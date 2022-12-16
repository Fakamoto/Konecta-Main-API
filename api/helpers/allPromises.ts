/* eslint-disable */
import { IllegalStateError } from './errors';

/**
 * Sequelize has transaction and to avoid passing the transaction manually to all the queries, what is done
 * is that the transaction is automatically injected. The problem with this, at least in sequelize 5 and
 * with how we have it configured, is that if the transaction ends and afterwards a query is run inside the
 * transaction, for some reason it's not injected.
 * So, to avoid that, we never have to have queries that run in parallel unless we await until they are all
 * done. What we do then is that instead of using Promise.all, which throws the exception the moment any of
 * the promises throws an exception, we use allPromises which uses .allSettled.
 * The difference is that .allSettled will await until all promises have finished, even if one of them throws.
 * The behaviour only changes for the cases where an exception is thrown, so there is no performance issue,
 * the queries are still running in parallel.
 *
 * Also, the typing is overload multiple times the same way Promise.all is defined, it's to only way to allow
 * multiple types in the promises without falling back to any.
 */
export function allPromises<A, B, C, D, E, F, G, H, I, J>(promises: [Promise<A>, Promise<B>, Promise<C>,
    Promise<D>, Promise<E>, Promise<F>, Promise<G>, Promise<H>,
    Promise<I>, Promise<J>]): Promise<[A, B, C, D, E, F, G, H, I, J]>;
export function allPromises<A, B, C, D, E, F, G, H, I>(promises: [Promise<A>, Promise<B>, Promise<C>,
    Promise<D>, Promise<E>, Promise<F>, Promise<G>, Promise<H>,
    Promise<I>]): Promise<[A, B, C, D, E, F, G, H, I]>;
export function allPromises<A, B, C, D, E, F, G, H>(promises: [Promise<A>, Promise<B>, Promise<C>, Promise<D>,
    Promise<E>, Promise<F>, Promise<G>, Promise<H>]): Promise<[A, B, C, D, E, F, G, H]>;
export function allPromises<A, B, C, D, E, F, G>(promises: [Promise<A>, Promise<B>, Promise<C>, Promise<D>,
    Promise<E>, Promise<F>, Promise<G>]): Promise<[A, B, C, D, E, F, G]>;
export function allPromises<A, B, C, D, E, F>(promises: [Promise<A>, Promise<B>, Promise<C>, Promise<D>,
    Promise<E>, Promise<F>]): Promise<[A, B, C, D, E, F]>;
export function allPromises<A, B, C, D, E>(promises: [Promise<A>, Promise<B>, Promise<C>, Promise<D>,
    Promise<E>]): Promise<[A, B, C, D, E]>;
export function allPromises<A, B, C, D>(promises: [Promise<A>, Promise<B>, Promise<C>,
    Promise<D>]): Promise<[A, B, C, D]>;
export function allPromises<A, B, C>(promises: [Promise<A>, Promise<B>, Promise<C>]): Promise<[A, B, C]>;
export function allPromises<A, B>(promises: [Promise<A>, Promise<B>]): Promise<[A, B]>;
export function allPromises<A>(promises: [Promise<A>]): Promise<[A]>;
// fallback to unknown length
export function allPromises<T>(promises: Iterable<T | PromiseLike<T>>): Promise<T[]>;
export function allPromises<T>(promises: Iterable<T | PromiseLike<T>>): Promise<T[]> {
    return Promise.allSettled(promises)
        .then((promisesResults: PromiseSettledResult<any>[]) => {
            promisesResults.forEach((result) => {
                if (result.status !== 'fulfilled') throw result.reason;
            });
            return promisesResults.map((result) => {
                if (result.status !== 'fulfilled') throw new IllegalStateError();
                return result.value;
            });
        }).catch((error: any) => { throw error; });
}
