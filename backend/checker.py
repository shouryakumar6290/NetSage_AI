import re

def check_rules(command_outputs: dict) -> list:
    """
    Runs deterministic checks on network command outputs.
    command_outputs: dict of command -> output string
    Returns a list of dicts: [{'status': 'warn'|'ok', 'message': '...'}]
    """
    results = []

    # Check 1: Interface Down
    int_brief = command_outputs.get("show ip interface brief", "")
    if int_brief:
        lines = int_brief.split('\n')
        down_found = False
        for line in lines:
            if "administratively down" in line or "down" in line.split()[-2:]:
                match = re.match(r'^(\S+)', line)
                if match:
                    results.append({"status": "warn", "message": f"Interface {match.group(1)} is down or administratively down."})
                    down_found = True
        if not down_found:
            results.append({"status": "ok", "message": "No down interfaces detected in brief."})

    # Check 2: Missing VLAN
    vlan_brief = command_outputs.get("show vlan brief", "")
    expected_vlan = command_outputs.get("_expected_vlan", "") # passed as a hint if available
    if vlan_brief and expected_vlan:
        if re.search(r'^' + str(expected_vlan) + r'\b', vlan_brief, re.MULTILINE):
            results.append({"status": "ok", "message": f"VLAN {expected_vlan} exists."})
        else:
            results.append({"status": "warn", "message": f"Expected VLAN {expected_vlan} is missing from VLAN database."})

    # Check 3: Duplicate IP (via ARP or explicit text)
    arp = command_outputs.get("show arp", "")
    if arp:
        ip_macs = {}
        dup_found = False
        for line in arp.split('\n'):
            parts = line.split()
            if len(parts) >= 4 and "." in parts[1]: # Basic heuristic for IP
                ip = parts[1]
                mac = parts[3]
                if ip in ip_macs and ip_macs[ip] != mac:
                    results.append({"status": "warn", "message": f"Duplicate IP detected: {ip} is held by multiple MACs."})
                    dup_found = True
                ip_macs[ip] = mac
        if not dup_found:
            results.append({"status": "ok", "message": "No duplicate IPs detected in ARP table."})

    # Check 4: Missing Route
    ip_route = command_outputs.get("show ip route", "")
    expected_route = command_outputs.get("_expected_route", "")
    if ip_route and expected_route:
        if expected_route in ip_route:
            results.append({"status": "ok", "message": f"Route to {expected_route} found."})
        else:
            results.append({"status": "warn", "message": f"Route to {expected_route} not found in routing table."})

    # If no checks were applicable
    if not results:
        results.append({"status": "info", "message": "No deterministic rules matched the provided output."})

    return results

if __name__ == "__main__":
    test_output = {
        "show ip interface brief": "GigabitEthernet0/0 unassigned YES unset administratively down down\nGigabitEthernet0/1 192.168.1.1 YES manual up up"
    }
    print(check_rules(test_output))
