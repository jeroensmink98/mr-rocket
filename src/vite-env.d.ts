/// <reference types="vite/client" />

import { Controller } from "./Controller";

declare global {
  interface Window {
    controller: Controller;
  }
}
