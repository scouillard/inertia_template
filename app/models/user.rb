class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [ :google_oauth2 ]

  enum :role, { member: "member", admin: "admin" }, prefix: true, validate: true

  validates :name, presence: true

  has_many :sent_invitations, class_name: "Invitation", foreign_key: :invited_by_id, dependent: :destroy
  has_many :notifications, as: :recipient, dependent: :destroy, class_name: "Noticed::Notification"

  after_create_commit :send_welcome_notification

  def initials
    parts = name.split
    if parts.size >= 2
      "#{parts.first[0]}#{parts.last[0]}".upcase
    else
      parts.first[0, 2].upcase
    end
  end

  private

  def send_welcome_notification
    WelcomeNotifier.with(recipient: self).deliver(self)
  end

  def self.from_omniauth(auth)
    user = find_by(provider: auth.provider, uid: auth.uid)
    user ||= find_by(email: auth.info.email)

    if user
      user.update(provider: auth.provider, uid: auth.uid)
      return user
    end

    nil
  end
end
