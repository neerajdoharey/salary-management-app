require "test_helper"

class Api::V1::EmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @employee = employees(:one)
    @headers = auth_headers_for(@user)
  end

  test "should get index with pagination metadata when authenticated" do
    get api_v1_employees_url, headers: @headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert json["employees"].is_a?(Array)
    assert json["meta"].present?
    assert json["meta"]["current_page"].present?
    assert json["meta"]["total_count"].present?
  end

  test "should filter index by department and country" do
    get api_v1_employees_url(department: "Engineering", country: "France"), headers: @headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert json["employees"].all? { |e| e["department"] == "Engineering" && e["country"] == "France" }
  end

  test "should search index by query" do
    get api_v1_employees_url(search: "Wiza"), headers: @headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert json["employees"].any? { |e| e["last_name"] == "Wiza" }
  end

  test "should show employee" do
    get api_v1_employee_url(@employee), headers: @headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal @employee.id, json["id"]
    assert_equal @employee.email, json["email"]
  end

  test "should create employee" do
    assert_difference("Employee.count", 1) do
      post api_v1_employees_url, params: {
        first_name: "Alice",
        last_name: "Smith",
        email: "alice.smith.test@acme.com",
        job_title: "Product Manager",
        department: "Product",
        country: "Canada",
        salary: 110000.00
      }, headers: @headers
    end

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "alice.smith.test@acme.com", json["email"]
  end

  test "should update employee" do
    patch api_v1_employee_url(@employee), params: {
      salary: 105000.00,
      job_title: "Lead Engineer"
    }, headers: @headers

    assert_response :ok
    @employee.reload
    assert_equal 105000.00, @employee.salary.to_f
    assert_equal "Lead Engineer", @employee.job_title
  end

  test "should destroy employee" do
    assert_difference("Employee.count", -1) do
      delete api_v1_employee_url(@employee), headers: @headers
    end

    assert_response :no_content
  end

  test "should enqueue bulk import background job via CSV file" do
    csv_data = "first_name,last_name,email,job_title,department,country,salary\n" \
               "Jane,Doe,jane.doe.csv@acme.com,Accountant,Finance,Germany,85000\n" \
               "Bob,Builder,bob.builder.csv@acme.com,Architect,Engineering,United Kingdom,95000"

    file = Rack::Test::UploadedFile.new(
      StringIO.new(csv_data),
      "text/csv",
      original_filename: "employees.csv"
    )

    assert_enqueued_with(job: BulkImportEmployeesJob) do
      post import_api_v1_employees_url, params: { file: file }, headers: @headers
    end

    assert_response :accepted
    json = JSON.parse(response.body)
    assert_includes json["message"], "background"
    assert_equal "processing", json["status"]
  end

  test "should process import synchronously when sync param is passed" do
    csv_data = "first_name,last_name,email,job_title,department,country,salary\n" \
               "Jane,Doe,jane.doe.csv@acme.com,Accountant,Finance,Germany,85000\n" \
               "Bob,Builder,bob.builder.csv@acme.com,Architect,Engineering,United Kingdom,95000"

    file = Rack::Test::UploadedFile.new(
      StringIO.new(csv_data),
      "text/csv",
      original_filename: "employees.csv"
    )

    assert_difference("Employee.count", 2) do
      post import_api_v1_employees_url, params: { file: file, sync: "true" }, headers: @headers
    end

    assert_response :ok
    json = JSON.parse(response.body)
    assert_equal "Import complete", json["message"]
  end

  test "should return unauthorized when missing auth token" do
    get api_v1_employees_url
    assert_response :unauthorized
  end
end
