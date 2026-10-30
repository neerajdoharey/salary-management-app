require "test_helper"

class EmployeeTest < ActiveSupport::TestCase
  setup do
    @employee = employees(:one)
  end

  test "valid employee" do
    assert @employee.valid?
  end

  test "invalid without required attributes" do
    emp = Employee.new
    assert_not emp.valid?
    assert_includes emp.errors[:first_name], "can't be blank"
    assert_includes emp.errors[:last_name], "can't be blank"
    assert_includes emp.errors[:email], "can't be blank"
    assert_includes emp.errors[:job_title], "can't be blank"
    assert_includes emp.errors[:department], "can't be blank"
    assert_includes emp.errors[:country], "can't be blank"
    assert_includes emp.errors[:salary], "can't be blank"
  end

  test "invalid with negative salary" do
    @employee.salary = -100
    assert_not @employee.valid?
    assert_includes @employee.errors[:salary], "must be greater than or equal to 0"
  end

  test "invalid with duplicate email" do
    dup_employee = Employee.new(
      first_name: "John",
      last_name: "Smith",
      email: @employee.email,
      job_title: "Developer",
      department: "Engineering",
      country: "United States",
      salary: 80000
    )
    assert_not dup_employee.valid?
    assert_includes dup_employee.errors[:email], "has already been taken"
  end

  test "by_country scope" do
    results = Employee.by_country("France")
    assert_includes results, employees(:one)
    assert_not_includes results, employees(:two)
  end

  test "by_department scope" do
    results = Employee.by_department("Engineering")
    assert_includes results, employees(:one)
    assert_not_includes results, employees(:two)
  end

  test "by_salary_range scope" do
    results = Employee.by_salary_range(100000, 150000)
    assert_includes results, employees(:two)
    assert_not_includes results, employees(:one)
  end

  test "search_query scope" do
    results = Employee.search_query("Connor")
    assert_includes results, employees(:two)
    assert_not_includes results, employees(:one)
  end

  test "full_name returns combined names" do
    assert_equal "Leo Wiza", employees(:one).full_name
  end
end
