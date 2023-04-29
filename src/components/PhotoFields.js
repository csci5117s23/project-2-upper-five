function PhotoFields({ handleUploadPhoto, photo, setCameraOpen }) {
	return (
		<div className="field">
			<button className="button is-warning" type="button" onClick={() => setCameraOpen(true)}>
				Open Camera
			</button>
			<p className="has-text-weight-bold is-size-4 mt-4">Or</p>
			<div className="file is-info has-name mt-4">
				<label className="file-label">
					<input
						className="file-input"
						type="file"
						name="photo"
						onChange={handleUploadPhoto}
						required
					/>
					<span className="file-cta">
						<span className="file-icon">
							<i className="fas fa-upload"></i>
						</span>
						<span className="file-label">Upload Photo</span>
					</span>
					<span className="file-name">{photo ? photo.name : "No file selected"}</span>
				</label>
			</div>
		</div>
	);
}

export default PhotoFields;
