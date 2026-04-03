class UserMailerPreview < ActionMailer::Preview
  def invitation
    invited_by = User.first
    invitation = Invitation.new(
      email: "jane@example.com",
      invited_by: invited_by,
      expires_at: 7.days.from_now,
      token: "previewtoken1234567890ab"
    )
    UserMailer.invitation(invitation)
  end
end
