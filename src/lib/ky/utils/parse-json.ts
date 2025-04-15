export default function parseJSON(data:string){
    return JSON.parse(data, (_, value)=>{
        if (typeof value !=='string'){
            return value
        }

        try{
            const parsed = new Date(value)
            if(parsed.toISOString() === value){
                return parsed
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }catch(_){
            ///
        }
        return value
    })
}