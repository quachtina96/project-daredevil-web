defmodule DaredevilWeb.Router do
  use DaredevilWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", DaredevilWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/daredevil", DaredevilController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", DaredevilWeb do
  #   pipe_through :api
  # end
end
