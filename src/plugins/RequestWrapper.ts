import * as Hapi from '@hapi/hapi';
import { createNamespace } from 'cls-hooked';
import { TRACING, HTTP_HEADERS, CLS_NAMESPACE } from '../core/common/Constants';

import { v4 as uuidv4 } from 'uuid'
const session = createNamespace(CLS_NAMESPACE);

const handleHapiRequest = async (
  hapiRequest: Hapi.Request,
  hapiResponse: Hapi.ResponseToolkit
) => {
  const transactionId = hapiRequest.headers[TRACING.TRANSACTION_ID] || uuidv4();
  const authToken = hapiRequest.headers[HTTP_HEADERS.AUTH];
  session.bindEmitter(hapiRequest.raw.req);
  session.bindEmitter(hapiRequest.raw.res);

  const clsCtx = session.createContext();
  session.enter(clsCtx);
  hapiRequest.app[TRACING.TRACER_SESSION] = {
    context: clsCtx
  };

  session.set(TRACING.TRANSACTION_ID, transactionId);
  session.set(HTTP_HEADERS.AUTH, authToken);
  return hapiResponse.continue;
};

const requestWrapper: Hapi.Plugin<{}> = {
  name: 'requestWrapper',
  version: '1.0.0',
  register: (server: Hapi.Server) => {
    server.ext('onRequest', handleHapiRequest);
  },
  once: true
};

export default requestWrapper;
