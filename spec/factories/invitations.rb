FactoryBot.define do
  factory :invitation do
    sequence(:email) { |n| "invite#{n}@example.com" }
    expires_at { 7.days.from_now }
    association :invited_by, factory: :user

    trait :expired do
      after(:create) { |inv| inv.update_column(:expires_at, 1.day.ago) }
    end

    trait :accepted do
      accepted_at { 1.hour.ago }
    end
  end
end
