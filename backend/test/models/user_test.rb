require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "valid user" do
    user = User.new(email: "valid@acme.com", password: "Password@12345", password_confirmation: "Password@12345")
    assert user.valid?
  end

  test "invalid without email" do
    user = User.new(password: "Password@12345")
    assert_not user.valid?
    assert_includes user.errors[:email], "can't be blank"
  end

  test "invalid with duplicate email" do
    existing_user = users(:one)
    duplicate_user = User.new(email: existing_user.email, password: "Password@12345")
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors[:email], "has already been taken"
  end

  test "normalizes email to lowercase and stripped" do
    user = User.create!(email: "  USER@ACME.COM  ", password: "Password@12345", password_confirmation: "Password@12345")
    assert_equal "user@acme.com", user.email
  end

  test "authenticates by email and password" do
    user = users(:one)
    authenticated_user = User.authenticate_by(email: user.email, password: "Password@12345")
    assert_equal user, authenticated_user
  end
end
