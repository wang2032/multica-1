"""
Travel Budget Tracking Module

Supports recording expenses by category (transportation, accommodation, dining)
and calculating total budget.
"""

from enum import Enum
from dataclasses import dataclass
from typing import List, Dict


class ExpenseType(Enum):
    """Types of travel expenses"""
    TRANSPORTATION = "transportation"
    ACCOMMODATION = "accommodation"
    DINING = "dining"


@dataclass
class Expense:
    """Represents a single expense entry"""
    amount: float
    expense_type: ExpenseType
    description: str = ""


class TravelBudget:
    """Travel budget tracker with expense categorization"""

    def __init__(self):
        self.expenses: List[Expense] = []

    def add_expense(self, amount: float, expense_type: ExpenseType, description: str = "") -> Expense:
        """Add a new expense entry"""
        expense = Expense(amount=amount, expense_type=expense_type, description=description)
        self.expenses.append(expense)
        return expense

    def get_total(self) -> float:
        """Calculate total budget spent"""
        return sum(e.amount for e in self.expenses)

    def get_total_by_type(self, expense_type: ExpenseType) -> float:
        """Calculate total spent for a specific expense type"""
        return sum(e.amount for e in self.expenses if e.expense_type == expense_type)

    def get_summary(self) -> Dict[str, float]:
        """Get summary of all expenses by type with total"""
        summary = {et.value: self.get_total_by_type(et) for et in ExpenseType}
        summary["total"] = self.get_total()
        return summary

    def clear(self):
        """Clear all expenses"""
        self.expenses.clear()