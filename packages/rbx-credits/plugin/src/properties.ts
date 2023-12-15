/**
 * Raw value to send to the server as is since it's easier to parse asset id in JS
 */
export type RawAssetValue = number | string;

export interface AssetProperies {
	[key: string]: RawAssetValue;
}

export function getAssetProperties(instance: Instance): AssetProperies {
	if (instance.IsA('Animation')) {
		const { AnimationId } = instance;
		return {
			AnimationId: AnimationId,
		};
	}

	if (instance.IsA('BackpackItem')) {
		// Also covers: Tool, HopperBin

		const { TextureId } = instance;
		return {
			TextureId: TextureId,
		};
	}

	if (instance.IsA('CharacterMesh')) {
		const { BaseTextureId, MeshId, OverlayTextureId } = instance;
		return {
			BaseTextureId: BaseTextureId,
			MeshId: MeshId,
			OverlayTextureId: OverlayTextureId,
		};
	}

	if (instance.IsA('Decal')) {
		// Also covers: Texture

		const { Texture } = instance;
		return {
			Texture: Texture,
		};
	}

	if (instance.IsA('FileMesh')) {
		// Also covers: SpecialMesh

		const { MeshId, TextureId } = instance;
		return {
			MeshId: MeshId,
			TextureId: TextureId,
		};
	}

	if (instance.IsA('FloorWire')) {
		// Deprecated but may be still used

		const { Texture } = instance;
		return {
			Texture: Texture,
		};
	}

	if (instance.IsA('ImageLabel')) {
		const { Image } = instance;
		return {
			Image: Image,
		};
	}

	if (instance.IsA('ImageButton')) {
		const { HoverImage, Image, PressedImage } = instance;
		return {
			HoverImage: HoverImage,
			Image: Image,
			PressedImage: PressedImage,
		};
	}

	if (instance.IsA('MeshPart')) {
		const { MeshId, TextureID } = instance;
		return {
			MeshId: MeshId,
			TextureID: TextureID,
		};
	}

	if (instance.IsA('Pants')) {
		const { PantsTemplate } = instance;
		return {
			PantsTemplate: PantsTemplate,
		};
	}

	if (instance.IsA('ParticleEmitter')) {
		const { Texture } = instance;
		return {
			Texture: Texture,
		};
	}

	if (instance.IsA('ScrollingFrame')) {
		const { BottomImage, MidImage, TopImage } = instance;
		return {
			BottomImage: BottomImage,
			MidImage: MidImage,
			TopImage: TopImage,
		};
	}

	if (instance.IsA('Shirt')) {
		const { ShirtTemplate } = instance;
		return {
			ShirtTemplate: ShirtTemplate,
		};
	}

	if (instance.IsA('ShirtGraphic')) {
		const { Graphic } = instance;
		return {
			Graphic: Graphic,
		};
	}

	if (instance.IsA('Sound')) {
		const { SoundId } = instance;
		return {
			SoundId: SoundId,
		};
	}

	return {};
}
