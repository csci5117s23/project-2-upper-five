export default function AddForm(){
    function addItem(e){
        e.preventDefault();

        // TODO:
    }
    return <>
        {/* Bulma form */}
        <div class="container is-widescreen">
            <form id="add-form" onSubmit={addItem}>
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input class="input" type="text" placeholder=""></input>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Image</label>
                    <div class="control">
                        <input class="input" type="file"></input>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Type</label>
                    <div class="control">
                        <div class="select">
                        <select>
                            <option>Top</option>
                            <option>Bottom</option>
                            <option>Shoes</option>
                            <option>Accessory</option>
                        </select>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Occasion</label>
                    <div class="control">
                        <div class="select">
                        <select>
                            <option>Formal</option>
                            <option>Casual</option>
                            <option>Business Casual</option>
                        </select>
                        </div>
                    </div>
                </div>

                <div class="field">
                    <label class="label">Own</label>
                    <div class="control">
                        <label class="radio">
                        <input type="radio" name="own-yes"></input>
                        Yes
                        </label>
                        <label class="radio">
                        <input type="radio" name="own-no"></input>
                        No
                        </label>
                    </div>
                </div>

                <div class="field">
                    <p class="control">
                        <button class="button is-success">
                            Finish
                        </button>
                    </p>
                </div>

                
            </form>
        </div>
    </>
}