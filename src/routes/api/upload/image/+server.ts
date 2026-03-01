import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = 'static/uploads';

const MIME_TO_EXT: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/gif': 'gif',
	'image/webp': 'webp'
};

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file');

	if (!file || !(file instanceof File)) {
		return error(400, { message: '请选择要上传的文件' });
	}

	if (!ALLOWED_TYPES.has(file.type)) {
		return error(400, { message: '只支持 JPEG、PNG、GIF、WebP 格式的图片' });
	}

	if (file.size > MAX_SIZE) {
		return error(400, { message: '文件大小不能超过 5MB' });
	}

	const ext = MIME_TO_EXT[file.type] || 'jpg';
	const filename = `${randomUUID()}.${ext}`;
	const filepath = join(UPLOAD_DIR, filename);

	if (!existsSync(UPLOAD_DIR)) {
		await mkdir(UPLOAD_DIR, { recursive: true });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(filepath, buffer);

	return json({ url: `/uploads/${filename}` });
};
