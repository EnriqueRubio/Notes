class Collection
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title, type: String
  field :description, type: String
  field :textColor, type: String
  field :bgColor, type: String
  field :borderColor, type: String
  #field :notes, type: Array, default: []

  belongs_to :author, class_name: "User"
  has_and_belongs_to_many :shared_to, class_name: "User"
  has_and_belongs_to_many :notes, class_name: "Note", inverse_of: :parent_collections

  validates_presence_of :title
end
