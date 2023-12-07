
class ST {
    constructor(maxEntries){
        this.maxEntries = maxEntries;
        this.entriesCount = 0;
        this.table = new Map();
    }

    #removeLast = () =>{
        this.table.delete(this.table.keys().next().value);
        this.entriesCount--;
    }

    add(key, value){
        if(this.entriesCount >= this.maxEntries){
            this.#removeLast();
        }
        this.table.set(key, value);
        this.entriesCount++;
    }

    exists(key){
        return this.table.has(key);
    }

    get(key){
        return this.table.get(key);
    }

    remove(key){
        this.table.delete(key);
        this.entriesCount--;
    }
}

module.exports = ST;