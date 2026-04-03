class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  enum :role, { member: "member", admin: "admin" }, prefix: true, validate: true

  validates :name, presence: true

  has_many :sent_invitations, class_name: "Invitation", foreign_key: :invited_by_id, dependent: :destroy

  def initials
    parts = name.split
    if parts.size >= 2
      "#{parts.first[0]}#{parts.last[0]}".upcase
    else
      parts.first[0, 2].upcase
    end
  end
end
