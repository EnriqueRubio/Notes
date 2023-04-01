class Api::CollectionsController < ApplicationController
  before_action :set_collection, only: %i[ show update destroy add_note remove_note ]
  before_action :authenticate_api_user!

  # GET /collections
  def index
    @collections = Collection.where(author: current_api_user.id)
    render json: @collections
  end

  # GET /collections/1
  def show
    render json: @collection
  end

  # POST /collections
  def create
    @collection = Collection.new(collection_params)
    @collection.author = current_api_user.id

    if @collection.save
      render json: @collection, status: :created
    else
      render json: @collection.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /collections/1
  def update
    @collection.author = current_api_user.id

    if @collection.update(collection_params)
      render json: @collection
    else
      render json: @collection.errors, status: :unprocessable_entity
    end
  end

  # POST /collections/:collection_id/add_note
  def add_note
    @note = Note.find(params[:note_id])
    @note.parent_collection_id = @collection.id
    @note.save
  
    # Aquí va la lógica para añadir la nota a la colección
    @collection.notes << @note.id
  
    if @collection.save
      render json: { message: 'Note successfully added to collection' }, status: :ok
    else
      puts "Error saving collection: #{@collection.errors.full_messages}"
      render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /collections/:collection_id/remove_note
  def remove_note
    @note = Note.find(params[:note_id])
    @note.parent_collection_id = nil
    @note.save

    # Aquí va la lógica para eliminar la nota de la colección
    @collection.notes.delete(@note.id)

    if @collection.save
      render json: { message: 'Note successfully removed from collection' }, status: :ok
    else
      puts "Error saving collection: #{@collection.errors.full_messages}"
      render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
    end
  end


  # DELETE /collections/1
  def destroy
    notes = Note.where(parent_collection_id: @collection._id)
    notes.each do |note|
      note.parent_collection_id = nil
      note.save
    end

    @collection.destroy
  end

  private

  def set_collection
    puts("Setting collection: #{params[:id]}")
    @collection = Collection.find(params[:id])
  end

  def collection_params
    params.require(:collection).permit(:title, :description, :textColor, :bgColor, :borderColor, :author, :shared_to, :notes)
  end
end
