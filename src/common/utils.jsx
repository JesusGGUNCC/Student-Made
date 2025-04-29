
class Utils {
    static useMock(){
        return import.meta.env.VITE_USE_MOCK === 'true';
    }
}

export default Utils;