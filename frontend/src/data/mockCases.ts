export interface CaseType {
  case_id: string;
  title: string;
  symptom: string;
  topology_note: string;
  show_output: string;
  expected_fault: string;
  osi_layer: string;
  concept: string;
  severity: string;
  expected_next_command: string;
  expected_fix: string;
}

export const mockCases: CaseType[] = [
  {
    case_id: "NS-001",
    title: "PC cannot ping server in same VLAN",
    symptom: "PC1 gets an IP but cannot reach Server1.",
    topology_note: "PC1 is on Fa0/1, Server1 is on Fa0/2. Both should be VLAN 10.",
    show_output: "Switch# show vlan brief\n1    default                          active    Fa0/3, Fa0/4\n10   Servers                          active    Fa0/1\n20   Clients                          active    Fa0/2",
    expected_fault: "PC and Server are in different VLANs (Fa0/2 is in VLAN 20 instead of 10)",
    osi_layer: "Layer 2",
    concept: "VLAN",
    severity: "Medium",
    expected_next_command: "show interfaces status",
    expected_fix: "Reassign Fa0/2 to VLAN 10 using 'switchport access vlan 10'."
  },
  {
    case_id: "NS-014",
    title: "Missing Static Route",
    symptom: "Cannot reach branch office subnet 10.20.0.0/16.",
    topology_note: "HQ Router connected to Branch Router.",
    show_output: "HQ_Router# show ip route\nC 10.10.0.0/16 is directly connected\nC 192.168.1.0/24 is directly connected",
    expected_fault: "No route to 10.20.0.0/16 exists.",
    osi_layer: "Layer 3",
    concept: "Routing",
    severity: "High",
    expected_next_command: "ping 10.20.0.1",
    expected_fix: "Add static route: 'ip route 10.20.0.0 255.255.0.0 <next_hop>'."
  }
];
