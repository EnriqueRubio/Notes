FactoryBot.define do
  factory :jwt_denylist do
    jti_string { "MyString" }
    exp { "2023-03-13 12:30:03" }
  end
end
