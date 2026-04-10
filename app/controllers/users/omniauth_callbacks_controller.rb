# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    auth = request.env["omniauth.auth"]
    user = User.from_omniauth(auth) || accept_invitation(auth)

    if user
      sign_in user, event: :authentication

      redirect_to root_path, notice: "Signed in successfully."
    else
      redirect_to new_user_session_path,
        alert: "You need a valid invitation to join."
    end
  end

  def failure
    redirect_to new_user_session_path, alert: "Google sign-in failed. Please try again."
  end

  private

  def accept_invitation(auth)
    invitation = Invitation.find_for_omniauth(auth, session_token: session.delete(:pending_invitation_token))
    invitation&.accept_with_google!(auth)
  end
end
