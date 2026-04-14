"""Test for travel budget tracking"""

from travel_budget import TravelBudget, ExpenseType


def test_budget_tracking():
    budget = TravelBudget()

    # Add sample expenses
    budget.add_expense(500, ExpenseType.TRANSPORTATION, "Flight tickets")
    budget.add_expense(200, ExpenseType.TRANSPORTATION, "Taxi")
    budget.add_expense(800, ExpenseType.ACCOMMODATION, "Hotel 4 nights")
    budget.add_expense(150, ExpenseType.DINING, "Dinner")
    budget.add_expense(80, ExpenseType.DINING, "Lunch")

    # Verify totals by type
    assert budget.get_total_by_type(ExpenseType.TRANSPORTATION) == 700
    assert budget.get_total_by_type(ExpenseType.ACCOMMODATION) == 800
    assert budget.get_total_by_type(ExpenseType.DINING) == 230

    # Verify total budget
    assert budget.get_total() == 1730

    # Verify summary
    summary = budget.get_summary()
    assert summary["transportation"] == 700
    assert summary["accommodation"] == 800
    assert summary["dining"] == 230
    assert summary["total"] == 1730

    print("All tests passed!")


if __name__ == "__main__":
    test_budget_tracking()