class Invitation < ApplicationRecord
  has_secure_token :token

  belongs_to :invited_by, class_name: "User"

  EXPIRY_DURATION = 7.days

  scope :unaccepted, -> { where(accepted_at: nil) }
  scope :pending, -> { where(accepted_at: nil).where(expires_at: Time.current..) }

  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :email, uniqueness: { conditions: -> { pending }, message: "already has a pending invitation" }
  validate :email_not_already_a_member

  before_create :set_expiry

  def pending?
    accepted_at.nil? && expires_at > Time.current
  end

  def resend!
    transaction do
      regenerate_token
      update!(expires_at: EXPIRY_DURATION.from_now)
    end
    UserMailer.invitation(self).deliver_later
  end

  def accept!(user_attrs)
    transaction do
      user = User.create!(user_attrs.merge(email: email))
      update!(accepted_at: Time.current)
      user
    end
  end

  def accept_with_google!(auth)
    transaction do
      user = User.create!(
        email: email,
        name: auth.info.name.presence || email.split("@").first,
        provider: auth.provider,
        uid: auth.uid,
        password: Devise.friendly_token[0, 20]
      )
      update!(accepted_at: Time.current)
      user
    end
  end

  private

  def set_expiry
    self.expires_at = EXPIRY_DURATION.from_now
  end

  def email_not_already_a_member
    errors.add(:email, "belongs to an existing member") if User.exists?(email: email)
  end
end
