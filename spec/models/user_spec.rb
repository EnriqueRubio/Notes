require 'rails_helper'

RSpec.describe User, type: :model do

  # Test that username field is required
  it { is_expected.to validate_presence_of(:username) }

  # Test that email field is required and has a valid format
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_format_of(:email).to_allow("test@example.com").not_to_allow("test") }

  # Test that password field is required and has a minimum length of 8 characters
  it { is_expected.to validate_presence_of(:password) }
  it { is_expected.to validate_length_of(:password).within(8..128) }

  # Test that admin field defaults to false
  it "should have admin set to false by default" do
    user = User.new(username: "test", email: "test@example.com", password: "password")
    expect(user.admin).to be false
  end

end