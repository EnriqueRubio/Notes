class Note
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  #field :creation_date, type: Date
  field :content, type: Hash
  field :attachments, type: Array

  belongs_to :author, class_name: "User"
  has_and_belongs_to_many :shared_to, class_name: "User"
  #belongs_to :parent_collection, class_name: "Collection", inverse_of: :notes, optional: true
  has_and_belongs_to_many :parent_collections, class_name: "Collection", inverse_of: :notes

  validates_presence_of :title
end
