require 'rails_helper'

RSpec.describe Note, type: :model do

    # Test that username field is required
    it { is_expected.to validate_presence_of(:title) }

    # Test that author field is required
    it { is_expected.to validate_presence_of(:author) }

    # Test that author field contains the id of its user
    it "should have author set to a valid user" do
        user = User.create(username: "test", email: "test@example.com", password: "password")
        note = Note.new(title: "Test", creation_date: Date.today, content: "Test", author: user)
        expect(note.author).to eq(user)
    end

    it "removes a record from the database" do
        expect(note).to be_persisted
        note.destroy
        expect(note).to be_destroyed
    end

end