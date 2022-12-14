import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import { HashRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";

const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <HashRouter>
      <App subgraphUri={subgraphUri} />
    </HashRouter>
  </ApolloProvider>,
  document.getElementById("root"),
);
