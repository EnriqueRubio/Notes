FactoryBot.define do
  factory :note do
    title { "Mi nota" }
    creation_date { Date.today }
    content { "Esta es una nota de prueba" }
    author { association :user }
  end
end