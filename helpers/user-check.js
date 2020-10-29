import User from '../models/user.model';
import Store from '../models/store.model';

export default {
    async checkUserExistAndSaveStoreJob(req, element) {
        const user = await User.findById(req.userData.userId);
        if (!user) {
            const error = new Error('Could not find user.');
            // @ts-ignore
            error.statusCode = 404;
            throw error;
        }
        // @ts-ignore
        const authStore = (await user).storeId;
        const store = await Store.findById(authStore);
        // @ts-ignore
        store.jobs.push(element);
        await store.save();
    },

    async checkUserExistAndRemoveStoreJob(req, element) {
        const user = await User.findById(req.userData.userId);
        if (!user) {
            const error = new Error('Could not find user.');
            // @ts-ignore
            error.statusCode = 404;
            throw error;
        }
        // @ts-ignore
        const authStore = (await user).storeId;
        const store = await Store.findById(authStore);
        // @ts-ignore
        store.jobs.pull(element);
        await store.save();
    },

    async checkUserExistAndSaveStoreOffer(req, element) {
        const user = await User.findById(req.userData.userId);
        if (!user) {
            const error = new Error('Could not find user.');
            // @ts-ignore
            error.statusCode = 404;
            throw error;
        }
        // @ts-ignore
        const authStore = (await user).storeId;
        const store = await Store.findById(authStore);
        // @ts-ignore
        store.offers.push(element);
        await store.save();
    },

    async checkUserExistAndRemoveStoreOffer(req, element) {
        const user = await User.findById(req.userData.userId);
        if (!user) {
            const error = new Error('Could not find user.');
            // @ts-ignore
            error.statusCode = 404;
            throw error;
        }
        // @ts-ignore
        const authStore = (await user).storeId;
        const store = await Store.findById(authStore);
        // @ts-ignore
        store.offers.pull(element);
        await store.save();
    },

    async checkUserExistAndSaveStoreProduct(req, element) {
        const user = await User.findById("5e2061bc228fef260c5576ef");
        if (!user) {
            const error = new Error('Could not find user.');
            // @ts-ignore
            error.statusCode = 404;
            throw error;
        }
        // @ts-ignore
        const authStore = (await user).storeId;
        const store = await Store.findById(authStore);
        // @ts-ignore
        store.products.push(element);
        await store.save();
    },

    async checkUserExistAndRemoveStoreProduct(req, element) {
        const user = await User.findById(req.userData.userId);
        if (!user) {
            const error = new Error('Could not find user.');
            // @ts-ignore
            error.statusCode = 404;
            throw error;
        }
        // @ts-ignore
        const authStore = (await user).storeId;
        const store = await Store.findById(authStore);
        // @ts-ignore
        store.products.pull(element);
        await store.save();
    }
};
