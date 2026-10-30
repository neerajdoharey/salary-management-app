require "test_helper"

class Api::V1::AnalyticsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @headers = auth_headers_for(@user)
  end

  test "should get analytics summary and aggregations when authenticated" do
    get api_v1_analytics_url, headers: @headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert json["summary"].present?
    assert json["summary"]["total_payroll"].present?
    assert json["summary"]["average_salary"].present?
    assert json["summary"]["total_employees"].present?
    assert json["by_country"].is_a?(Array)
    assert json["by_department"].is_a?(Array)
  end

  test "should return unauthorized when missing auth token" do
    get api_v1_analytics_url
    assert_response :unauthorized
  end
end
