# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    auth = request.env["omniauth.auth"]

    user = User.from_omniauth(auth)
    if user
      sign_in user, event: :authentication
      redirect_to root_path, notice: "Signed in successfully."
      return
    end

    # New user — require a pending invitation
    invitation_token = session.delete(:pending_invitation_token)
    invitation = Invitation.pending.find_by(token: invitation_token) if invitation_token
    invitation ||= Invitation.pending.find_by(email: auth.info.email)

    if invitation&.email == auth.info.email
      user = invitation.accept_with_google!(auth)
      sign_in user, event: :authentication
      redirect_to root_path, notice: "Welcome to MyApp!"
    else
      redirect_to new_user_session_path,
        alert: "You need a valid invitation to join. Ask an admin to invite #{auth.info.email}."
    end
  end

  def failure
    redirect_to new_user_session_path, alert: "Google sign-in failed. Please try again."
  end
end
