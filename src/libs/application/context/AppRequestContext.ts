import { RequestContext } from 'nestjs-request-context';
import { EntityManager } from 'typeorm';

/**
 * Setting some isolated context for each request.
 */

export class AppRequestContext extends RequestContext {
  requestId: string;
  transactionConnection?: EntityManager; // Para transacciones globales con TypeORM
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    const ctx: AppRequestContext = RequestContext.currentContext.req;
    return ctx;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  // Adaptado para TypeORM: devuelve EntityManager en lugar de DatabaseTransactionConnection
  static getTransactionConnection(): EntityManager | undefined {
    const ctx = this.getContext();
    return ctx.transactionConnection;
  }

  // Adaptado para TypeORM: establece EntityManager en lugar de DatabaseTransactionConnection
  static setTransactionConnection(transactionConnection?: EntityManager): void {
    const ctx = this.getContext();
    ctx.transactionConnection = transactionConnection;
  }

  // Limpia la conexión de la transacción (EntityManager en el contexto de TypeORM)
  static cleanTransactionConnection(): void {
    const ctx = this.getContext();
    ctx.transactionConnection = undefined;
  }
}
