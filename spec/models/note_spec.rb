require 'rails_helper'

RSpec.describe Note, type: :model do
  # Usar FactoryBot para crear una instancia válida de Note
  let!(:note) { create(:note) }

  # Probar que el modelo tiene los campos esperados
  it { is_expected.to have_field(:title).of_type(String) }
  it { is_expected.to have_field(:creation_date).of_type(Date) }
  it { is_expected.to have_field(:content).of_type(String) }
  it { is_expected.to have_field(:attachments).of_type(Array) }

  # Probar que el modelo tiene las asociaciones esperadas
  it { is_expected.to belong_to(:author).of_type(User) }
  it { is_expected.to have_and_belong_to_many(:shared_to).of_type(User) }

  # Probar que el modelo tiene las validaciones esperadas
  it { is_expected.to validate_presence_of(:title) }

  # Probar que el modelo guarda una nota en la base de datos
  it 'saves a note' do
    expect { create(:note) }.to change(Note, :count).by(1)
  end

  # Probar que el modelo recupera una nota de la base de datos
  it 'retrieves a note' do
    expect(Note.find(note.id)).to eq(note)
  end

  # Probar que el modelo actualiza una nota en la base de datos
  it 'updates a note' do
    note.update(title: 'New title')
    expect(Note.find(note.id).title).to eq('New title')
  end

  # Probar que el modelo destruye una nota en la base de datos
  it 'destroys a note' do
    expect { note.destroy }.to change(Note, :count).by(-1)
  end
end