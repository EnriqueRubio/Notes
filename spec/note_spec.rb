require 'rails_helper'

RSpec.describe Note do
    
    it "should search and update a note" do
        note = Note.where(title: 'Test')
        note.update_attribute(:content, "New description")

        new_note = Note.where(title: 'Test')
        
        expect(new_note.content).to eq("New description")
    end

end