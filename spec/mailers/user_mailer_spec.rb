require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  describe "#invitation" do
    it "delivers to the invitation email with the correct subject and accept URL" do
      invitation = create(:invitation)

      mail = UserMailer.invitation(invitation)

      expect(mail.to).to eq([ invitation.email ])
      expect(mail.subject).to include("invited to join")
      expect(mail.body.encoded).to include(invitation_url(token: invitation.token))
    end
  end
end
