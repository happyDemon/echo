import { Channel, PresenceChannel } from './../channel';

export abstract class Connector {

    /**
     * Default connector options.
     *
     * @type {Object}
     */
    private _defaultOptions: any = {
        auth: {
            headers: {}
        },
        authEndpoint: '/broadcasting/auth',
        connector: 'pusher',
        csrfToken: null,
        host: null,
        key: null,
        namespace: null
    };

    /**
     * Connector options.
     *
     * @type {object}
     */
    options: any;

    /**
     * Global options
     *
     * @type: {object}
     */
    settings: any;

    /**
     * Create a new class instance.
     *
     * @params  {any} options
     */
    constructor(options: any, settings: any) {
        this.setOptions(options);

        this.settings = settings;

        this.connect();
    }

    /**
     * Merge the custom options with the defaults.
     *
     * @param  {any}  options
     * @return {any}
     */
    protected setOptions(options: any): any {
        this.options = Object.assign(this._defaultOptions, options);

        if (this.csrfToken()) {
            this.options.auth.headers['X-CSRF-TOKEN'] = this.csrfToken();
        }

        return options;
    }

    /**
     * Extract the CSRF token from the page.
     *
     * @return {string}
     */
    protected csrfToken(): string {
        let selector = document.querySelector('meta[name="csrf-token"]');

        if (window['Laravel'] && window['Laravel'].csrfToken) {
            return window['Laravel'].csrfToken;
        } else if (this.options.csrfToken) {
            return this.options.csrfToken;
        } else if (selector) {
            return selector.getAttribute('content');
        }

        return null;
    }

    /**
     * Create a fresh connection.
     *
     * @retrn void
     */
    abstract connect(): void;

    /**
     * Get a channel instance by name.
     *
     * @param  {string}  channel
     * @return {PusherChannel}
     */
    abstract channel(channel: string): Channel;

    /**
     * Get a private channel instance by name.
     *
     * @param  {string} channel
     * @return {Channel}
     */
    abstract privateChannel(channel: string): Channel;

    /**
     * Get a presence channel instance by name.
     *
     * @param  {string} channel
     * @return {PresenceChannel}
     */
    abstract presenceChannel(channel: string): PresenceChannel;

    /**
     * Leave the given channel.
     *
     * @param  {string} channel
     * @return {void}
     */
    abstract leave(channel: string): void;

    /**
     * Get the socket_id of the connection.
     *
     * @return {string}
     */
    abstract socketId(): string;
}
