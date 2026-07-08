from pydantic import BaseModel, Field
from typing import Optional, List

class IncidentPayload(BaseModel):
    user_type: str = Field(..., description="Role: fan, volunteer, staff, organizer")
    language: str = Field(default="en", description="ISO language code")
    location_context: str = Field(..., description="Current gate, section, or GPS proximity data")
    query_or_incident: str = Field(..., description="The textual prompt or sensor anomaly report")
    accessibility_needs: Optional[List[str]] = Field(default=[], description="e.g., wheelchair, sensory_room")

class OperationalResponse(BaseModel):
    status: str = Field(..., description="Action execution status")
    routing_instructions: str = Field(..., description="Localized clear multi-lingual pathing directions")
    staff_dispatch_action: Optional[str] = Field(None, description="Actionable SOP items for nearby staff")
    safety_risk_assessment: str = Field(..., description="Chain-of-thought structural evaluation code")