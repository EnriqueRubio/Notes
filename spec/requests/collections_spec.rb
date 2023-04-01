require 'rails_helper'

RSpec.describe "Collections", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/collections/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/collections/show"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /create" do
    it "returns http success" do
      get "/collections/create"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /update" do
    it "returns http success" do
      get "/collections/update"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /destroy" do
    it "returns http success" do
      get "/collections/destroy"
      expect(response).to have_http_status(:success)
    end
  end

end
