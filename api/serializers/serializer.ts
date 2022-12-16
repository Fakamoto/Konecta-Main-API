import { SerializeError } from '../helpers/errors';

export abstract class Serializer<ModelType, SerializedType> {
    serializeList(serializableList: ModelType[]): SerializedType[] {
        if (serializableList == null) throw new SerializeError();
        const results: SerializedType[] = [];
        serializableList.forEach(
            (serializable: ModelType) => results.push(this.serialize(serializable)),
        );
        return results;
    }

    serializeIfExists(serializable?: ModelType): SerializedType | undefined {
        if (!serializable) return undefined;
        return this.serialize(serializable);
    }

    serializeListIfExists(serializableList?: ModelType[]): SerializedType[] | undefined {
        if (!serializableList) {
            return undefined;
        }
        return this.serializeList(serializableList);
    }

    abstract serialize(serializableObject: ModelType): SerializedType;
}
