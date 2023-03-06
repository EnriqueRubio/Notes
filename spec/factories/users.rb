FactoryBot.define do
  factory :user do
    username { "Juan" }
    email { "juan@example.com" }
    password { "123456" }
    admin { false }
  end
end