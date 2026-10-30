require "test_helper"

class Api::V1::OrganizationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @existing_org = organizations(:acme) # name: ACME Corp
  end

  test "should return exists true when organization name already exists" do
    get validate_api_v1_organizations_url(name: "ACME Corp")
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal "ACME Corp", json["name"]
    assert_equal true, json["exists"]
    assert_equal false, json["available"]
    assert_equal "An organization with this name already exists", json["message"]
  end

  test "should return available true when organization name is free" do
    get validate_api_v1_organizations_url(name: "Wayne Enterprises")
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal "Wayne Enterprises", json["name"]
    assert_equal "wayne-enterprises", json["slug"]
    assert_equal false, json["exists"]
    assert_equal true, json["available"]
    assert_equal "Organization name is available", json["message"]
  end

  test "should return bad request when name parameter is missing" do
    get validate_api_v1_organizations_url
    assert_response :bad_request

    json = JSON.parse(response.body)
    assert_equal "Parameter 'name' is required", json["error"]
  end
end
