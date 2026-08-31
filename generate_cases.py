import csv
import random

cases = []
case_id_counter = 1

def add_case(title, symptom, topology, show_output, fault, layer, concept, severity, next_cmd, fix):
    global case_id_counter
    cases.append({
        'case_id': f"NS-{case_id_counter:03d}",
        'title': title,
        'symptom': symptom,
        'topology_note': topology,
        'show_output': show_output,
        'expected_fault': fault,
        'osi_layer': layer,
        'concept': concept,
        'severity': severity,
        'expected_next_command': next_cmd,
        'expected_fix': fix
    })
    case_id_counter += 1

# VLAN Cases (4)
add_case(
    "PC cannot ping server in same VLAN",
    "PC1 gets an IP but cannot reach Server1.",
    "PC1 is on Fa0/1, Server1 is on Fa0/2. Both should be VLAN 10.",
    "Switch# show vlan brief\n1    default                          active    Fa0/3, Fa0/4\n10   Servers                          active    Fa0/1\n20   Clients                          active    Fa0/2",
    "PC and Server are in different VLANs (Fa0/2 is in VLAN 20 instead of 10)",
    "Layer 2", "VLAN", "Medium", "show interfaces status", "Reassign Fa0/2 to VLAN 10 using 'switchport access vlan 10'."
)
add_case(
    "Missing VLAN on switch",
    "Users report no network access.",
    "PC is connected to Fa0/1 configured for VLAN 30.",
    "Switch# show vlan brief\n1    default                          active    Fa0/2, Fa0/3\n10   Servers                          active    \n20   Clients                          active    ",
    "VLAN 30 does not exist in the VLAN database.",
    "Layer 2", "VLAN", "High", "show running-config interface fa0/1", "Create VLAN 30 using 'vlan 30'."
)
add_case(
    "VLAN interface is down",
    "Cannot route between VLANs.",
    "Router is doing router-on-a-stick. VLAN 10 and 20 configured.",
    "Router# show ip interface brief\nInterface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0     unassigned      YES unset  up                    up\nGigabitEthernet0/0.10  192.168.10.1    YES manual administratively down down\nGigabitEthernet0/0.20  192.168.20.1    YES manual up                    up",
    "Subinterface Gi0/0.10 is administratively down.",
    "Layer 1/2", "Interface Status", "High", "show running-config interface gi0/0.10", "Run 'no shutdown' on interface Gi0/0.10."
)
add_case(
    "Native VLAN mismatch",
    "CDP errors and spanning tree issues.",
    "Switch1 connected to Switch2 via trunk.",
    "Switch1# show interfaces trunk\nPort        Mode         Encapsulation  Status        Native vlan\nFa0/24      on           802.1q         trunking      1\n\nSwitch2# show interfaces trunk\nPort        Mode         Encapsulation  Status        Native vlan\nFa0/24      on           802.1q         trunking      99",
    "Native VLAN mismatch on trunk link (1 vs 99).",
    "Layer 2", "Trunking", "Medium", "show cdp neighbors detail", "Configure native VLAN to match on both ends."
)

# Gateway Cases (3)
add_case(
    "Incorrect Default Gateway on PC",
    "PC1 can ping local devices but cannot reach the internet.",
    "PC1 is on 192.168.1.0/24. Router IP is 192.168.1.1.",
    "C:\> ipconfig\nIPv4 Address. . . . . . . . . . . : 192.168.1.10\nSubnet Mask . . . . . . . . . . . : 255.255.255.0\nDefault Gateway . . . . . . . . . : 192.168.1.254",
    "PC is configured with the wrong default gateway.",
    "Layer 3", "Default Gateway", "High", "ping 192.168.1.1", "Change default gateway on PC to 192.168.1.1."
)
add_case(
    "Missing Default Gateway on Switch",
    "Cannot manage the switch from a remote subnet.",
    "Switch management IP is 10.0.0.2.",
    "Switch# show run | include default-gateway\n(no output)",
    "Switch lacks 'ip default-gateway' configuration.",
    "Layer 3", "Management", "Low", "show running-config", "Configure 'ip default-gateway 10.0.0.1' on the switch."
)
add_case(
    "Gateway mismatch in DHCP pool",
    "Clients get IP but cannot browse.",
    "DHCP server configured on Router.",
    "Router# show run | section dhcp\nip dhcp pool CLIENTS\n network 172.16.0.0 255.255.255.0\n default-router 172.16.1.1",
    "Default router in DHCP pool is outside the subnet.",
    "Layer 3", "DHCP", "Medium", "show ip dhcp binding", "Change default-router in DHCP pool to 172.16.0.1."
)

# DHCP Cases (3)
add_case(
    "DHCP Exhaustion",
    "New PCs cannot get an IP address.",
    "Subnet has 50 users. Pool is 192.168.1.0/24.",
    "Router# show ip dhcp binding\n(Outputs 253 bindings)\nRouter# show ip dhcp pool\nPool CLIENTS : \n Utilization mark (high/low)    : 100 / 0\n Subnet size (first/next)       : 0 / 0 \n Total addresses                : 254\n Leased addresses               : 253",
    "DHCP pool is exhausted.",
    "Layer 3", "DHCP", "High", "show ip dhcp pool", "Expand the DHCP pool or reduce lease times."
)
add_case(
    "Missing IP helper-address",
    "PCs on VLAN 20 do not get DHCP addresses.",
    "DHCP server is on VLAN 10.",
    "Router# show run int vlan 20\ninterface Vlan20\n ip address 192.168.20.1 255.255.255.0\n!",
    "No ip helper-address configured on the relay interface.",
    "Layer 3", "DHCP Relay", "High", "show ip interface vlan 20", "Add 'ip helper-address <DHCP_SERVER_IP>' to Vlan20 interface."
)
add_case(
    "Excluded addresses conflict",
    "Duplicate IP address warnings on network.",
    "Router DHCP server issues IPs.",
    "Router# show run | include exclude\nip dhcp excluded-address 192.168.1.1 192.168.1.5",
    "Static IPs 192.168.1.10-20 are not excluded and are being handed out.",
    "Layer 3", "DHCP", "Medium", "show ip dhcp conflict", "Add 'ip dhcp excluded-address' for the static IP ranges."
)

# DNS Cases (3)
add_case(
    "Missing DNS Server",
    "Users can ping 8.8.8.8 but cannot open websites.",
    "PC configured via static IP.",
    "C:\> ipconfig /all\nIPv4 Address: 192.168.1.10\nSubnet Mask: 255.255.255.0\nDefault Gateway: 192.168.1.1\nDNS Servers: ",
    "No DNS server configured.",
    "Layer 7", "DNS", "High", "nslookup google.com", "Configure DNS server IP on the PC."
)
add_case(
    "Wrong DNS IP in DHCP",
    "Clients cannot resolve names.",
    "DHCP server on router.",
    "Router# show run | section dhcp\nip dhcp pool LAN\n network 10.10.10.0 255.255.255.0\n dns-server 10.10.11.1",
    "DNS server IP is a typo, should be 10.10.10.1.",
    "Layer 7", "DNS", "Medium", "ping 10.10.11.1", "Update the dns-server command in the DHCP pool."
)
add_case(
    "Router domain-lookup disabled",
    "Cannot ping hostnames from router.",
    "Router connected to internet.",
    "Router# ping google.com\nTranslating \"google.com\"...domain server (255.255.255.255)\n% Unrecognized host or address, or protocol not running.",
    "ip domain-lookup is disabled or no name-server configured.",
    "Layer 7", "DNS", "Low", "show running-config | include domain", "Configure 'ip domain-lookup' and 'ip name-server'."
)

# Routing Cases (5)
add_case(
    "Missing Static Route",
    "Cannot reach branch office subnet 10.20.0.0/16.",
    "HQ Router connected to Branch Router.",
    "HQ_Router# show ip route\nC 10.10.0.0/16 is directly connected\nC 192.168.1.0/24 is directly connected",
    "No route to 10.20.0.0/16 exists.",
    "Layer 3", "Routing", "High", "ping 10.20.0.1", "Add static route: 'ip route 10.20.0.0 255.255.0.0 <next_hop>'."
)
add_case(
    "Wrong Next Hop",
    "Traffic to internet is failing.",
    "Router connected to ISP.",
    "Router# show ip route\nS* 0.0.0.0/0 [1/0] via 198.51.100.2",
    "Next hop for default route is wrong (should be 198.51.100.1).",
    "Layer 3", "Routing", "Critical", "show ip interface brief", "Correct the default route next-hop."
)
add_case(
    "OSPF Neighbor Down",
    "Missing routes from OSPF peer.",
    "Two routers connected via Gi0/0.",
    "Router# show ip ospf neighbor\n(no output)",
    "OSPF adjacency is not forming.",
    "Layer 3", "OSPF", "High", "show ip ospf interface", "Check OSPF network commands, hello timers, or MTU."
)
add_case(
    "Missing inter-VLAN routing",
    "VLAN 10 cannot ping VLAN 20.",
    "L3 Switch used for routing.",
    "Switch# show ip route\n(empty)",
    "ip routing is not enabled globally.",
    "Layer 3", "Inter-VLAN Routing", "High", "show running-config | include ip routing", "Run 'ip routing' in global configuration mode."
)
add_case(
    "Passive Interface blocks routing",
    "RIP routes not being advertised to neighbor.",
    "Router running RIPv2.",
    "Router# show ip protocols\nRouting Protocol is \"rip\"\nPassive Interface(s):\n  GigabitEthernet0/0",
    "Interface Gi0/0 is passive, blocking routing updates.",
    "Layer 3", "Routing", "Medium", "show run | section rip", "Remove 'passive-interface Gi0/0' under router rip."
)

# ACL Cases (3)
add_case(
    "Implicit Deny blocking traffic",
    "Web server is inaccessible from outside.",
    "Router with ACL applied inbound on WAN.",
    "Router# show access-lists\nExtended IP access list WAN_IN\n 10 permit tcp any host 203.0.113.10 eq 80",
    "ACL is missing permit statement for return traffic or other ports, implicit deny blocks it.",
    "Layer 3/4", "ACL", "High", "show ip access-lists", "Add required permit rules to the ACL."
)
add_case(
    "Wrong ACL direction",
    "Internal users cannot access the internet.",
    "ACL 100 blocks bad IPs.",
    "Router# show run int gi0/1\ninterface GigabitEthernet0/1\n ip access-group 100 in",
    "ACL applied inbound on the LAN interface instead of outbound on WAN.",
    "Layer 3", "ACL", "High", "show ip interface", "Apply ACL in the correct direction."
)
add_case(
    "Standard ACL placed wrong",
    "PC1 cannot reach Server1, but can't reach anything else either.",
    "Standard ACL blocks PC1 from Server.",
    "Router# show access-lists\nStandard IP access list 10\n 10 deny 192.168.1.10\n 20 permit any",
    "Standard ACL applied too close to source, blocking all traffic from PC1.",
    "Layer 3", "ACL", "Medium", "show ip interface", "Use Extended ACL or move Standard ACL closer to destination."
)

# NAT Cases (3)
add_case(
    "Missing NAT Inside/Outside",
    "Internet access fails for internal users.",
    "Router doing PAT.",
    "Router# show ip nat statistics\nTotal active translations: 0",
    "Interfaces lack 'ip nat inside' or 'ip nat outside'.",
    "Layer 3", "NAT", "High", "show run | include nat", "Configure 'ip nat inside' on LAN and 'ip nat outside' on WAN."
)
add_case(
    "Wrong NAT Pool / ACL",
    "Users cannot browse.",
    "NAT overload configured.",
    "Router# show run | include nat\nip nat inside source list 2 interface GigabitEthernet0/0 overload\nRouter# show access-lists\nStandard IP access list 2\n 10 permit 10.0.0.0 0.0.0.255",
    "ACL for NAT does not match the actual user subnet (e.g., 192.168.1.0).",
    "Layer 3", "NAT", "Medium", "show ip nat translations", "Correct the ACL used for NAT."
)
add_case(
    "Static NAT port typo",
    "External users reach wrong internal port.",
    "Port forwarding to web server.",
    "Router# show run | include nat\nip nat inside source static tcp 192.168.1.10 8080 203.0.113.5 80",
    "Traffic to port 80 is forwarded to 8080, but server runs on 80.",
    "Layer 3/4", "NAT", "Medium", "show ip nat translations", "Correct static NAT port mapping."
)

# Wireless Cases (3)
add_case(
    "SSID mismatch",
    "Laptops cannot see the Wi-Fi network.",
    "AP configured in autonomous mode.",
    "AP# show dot11 associations\n(empty)",
    "SSID broadcast is disabled or mismatched.",
    "Layer 1/2", "Wireless", "High", "show running-config interface dot11Radio0", "Enable SSID broadcast or fix SSID string."
)
add_case(
    "WPA Key mismatch",
    "Clients try to connect but get rejected.",
    "AP uses WPA2-PSK.",
    "AP# show logging\n%DOT11-4-CCMP_REPLAY: CCMP replay error",
    "Pre-shared key mismatch between client and AP.",
    "Layer 2", "Wireless Security", "Medium", "show run | section dot11", "Update PSK on client to match AP."
)
add_case(
    "AP on wrong switchport VLAN",
    "Wireless users get no IP address.",
    "AP connected to switchport.",
    "Switch# show interfaces trunk\n(no output)",
    "Switchport connected to AP is an access port instead of a trunk.",
    "Layer 2", "Wireless / VLAN", "High", "show running-config interface fa0/1", "Configure the AP switchport as a trunk."
)

# Interface/Trunk Cases (3)
add_case(
    "Port Security Violation",
    "PC loses connection after being swapped.",
    "Switchport has port-security enabled.",
    "Switch# show interfaces fa0/1 status\nPort      Name               Status       Vlan       Duplex  Speed Type\nFa0/1                        err-disabled 10         auto    auto  10/100BaseTX",
    "Port is in err-disabled state due to MAC violation.",
    "Layer 2", "Port Security", "High", "show port-security interface fa0/1", "Shut/no shut the port, or update the secure MAC."
)
add_case(
    "Duplex Mismatch",
    "Slow network performance, high collisions.",
    "Switch connected to old server.",
    "Switch# show interfaces fa0/1\nFastEthernet0/1 is up, line protocol is up\n  Half-duplex, 100Mb/s\n  ... 12345 collisions, 12 late collisions",
    "Duplex mismatch (Half vs Full).",
    "Layer 1", "Duplex", "Medium", "show interfaces status", "Configure 'duplex full' on both sides."
)
add_case(
    "Trunk allowed VLANs restrict traffic",
    "VLAN 20 users cannot reach the router.",
    "Switch trunk to router.",
    "Switch# show interfaces trunk\nPort        Mode         Encapsulation  Status        Native vlan\nGi0/1       on           802.1q         trunking      1\n\nPort        Vlans allowed on trunk\nGi0/1       1,10",
    "VLAN 20 is missing from the allowed VLAN list on the trunk.",
    "Layer 2", "Trunking", "High", "show running-config interface gi0/1", "Add VLAN 20 using 'switchport trunk allowed vlan add 20'."
)

# Adding extra cases to ensure we have exactly 30
add_case(
    "Duplicate IP",
    "Intermittent connection drops.",
    "Two PCs on same subnet.",
    "Switch# show arp\nProtocol  Address          Age (min)  Hardware Addr   Type   Interface\nInternet  192.168.1.10           0   0000.1111.2222  ARPA   Vlan1\nInternet  192.168.1.10           0   0000.3333.4444  ARPA   Vlan1",
    "Two MAC addresses hold the same IP address.",
    "Layer 3", "IP Addressing", "High", "show arp", "Change IP address of one device."
)
add_case(
    "Wrong Subnet Mask",
    "PC cannot ping gateway.",
    "PC IP: 192.168.1.10, GW: 192.168.1.1",
    "C:\> ipconfig\nIPv4 Address: 192.168.1.10\nSubnet Mask: 255.255.0.0",
    "Subnet mask is too broad (/16 instead of /24), causing incorrect routing.",
    "Layer 3", "Subnetting", "Medium", "ipconfig /all", "Correct the subnet mask on the PC."
)

with open('cases.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=cases[0].keys())
    writer.writeheader()
    for row in cases:
        writer.writerow(row)
print(f"Generated {len(cases)} cases.")
