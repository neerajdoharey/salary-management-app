require "test_helper"

class Api::V1::RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "should register new user with valid attributes" do
    assert_difference("User.count", 1) do
      post api_v1_sign_up_url, params: {
        email: "new.employee@acme.com",
        password: "Password@12345",
        password_confirmation: "Password@12345"
      }
    end

    assert_response :created

    json = JSON.parse(response.body)
    assert json["token"].present?
    assert_equal "new.employee@acme.com", json["user"]["email"]
  end

  test "should fail sign up with missing password" do
    assert_no_difference("User.count") do
      post api_v1_sign_up_url, params: { email: "invalid@acme.com" }
    end

    assert_response :unprocessable_entity

    json = JSON.parse(response.body)
    assert json["errors"].present?
  end

  test "should fail sign up with existing email" do
    existing_user = users(:one)

    assert_no_difference("User.count") do
      post api_v1_sign_up_url, params: {
        email: existing_user.email,
        password: "Password@12345",
        password_confirmation: "Password@12345"
      }
    end

    assert_response :unprocessable_entity
    json = JSON.parse(response.body)
    assert json["errors"].any? { |e| e.include?("has already been taken") }
  end
end
