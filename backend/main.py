from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import csv
import os
import checker

app = FastAPI(title="NetSage AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RuleCheckRequest(BaseModel):
    command_outputs: Dict[str, str]

@app.get("/api/cases")
def get_cases():
    cases_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cases.csv")
    if not os.path.exists(cases_path):
        return []
    
    cases = []
    with open(cases_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cases.append(row)
    return cases

@app.post("/api/check-rules")
def check_rules(req: RuleCheckRequest):
    results = checker.check_rules(req.command_outputs)
    return {"results": results}

@app.post("/api/diagnose")
def diagnose(req: dict):
    # Mock AI diagnosis for demo purposes without requiring API keys
    # In a real app, this would call an LLM with diagnose_prompt.md
    return {
        "root_cause": "The issue is likely due to a misconfiguration in the provided evidence.",
        "confidence": 85,
        "confidence_level": "High",
        "osi_layer": "Layer 3 - Network",
        "concept": "Routing / General",
        "evidence": ["Found suspicious output in the provided commands."],
        "next_command": "show ip interface brief",
        "fix_steps": ["Verify the configuration.", "Apply the correct settings.", "Restart the interface if necessary."],
        "verification_steps": ["Ping the destination to verify connectivity."],
        "alternative_causes": ["Hardware failure", "ACL blocking traffic"]
    }
