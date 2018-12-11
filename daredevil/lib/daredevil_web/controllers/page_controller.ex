defmodule DaredevilWeb.PageController do
  use DaredevilWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
