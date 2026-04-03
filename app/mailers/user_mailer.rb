class UserMailer < ApplicationMailer
  APP_NAME = "MyApp"

  def invitation(invitation)
    @invitation = invitation
    @app_name   = APP_NAME
    @accept_url = invitation_url(token: invitation.token)
    mail(to: invitation.email, subject: "You've been invited to join #{APP_NAME}")
  end
end
