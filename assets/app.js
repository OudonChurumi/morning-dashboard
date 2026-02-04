async function loadPosts() {
  const res = await fetch('./posts/posts.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('posts.json が読めません');
  const data = await res.json();
  if (!Array.isArray(data.posts)) throw new Error('posts.json の形式が不正です');
  return data.posts;
}

function normalize(s){
  return (s ?? '').toString().toLowerCase();
}

function matches(post, q){
  if (!q) return true;
  const hay = [
    post.date,
    post.comment,
    ...(post.tags ?? []),
    post.image
  ].map(normalize).join(' ');
  return hay.includes(q);
}

function render(posts){
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  for (const p of posts){
    const card = document.createElement('article');
    card.className = 'card';

    const img = document.createElement('img');
    img.className = 'thumb';
    img.loading = 'lazy';
    img.alt = p.alt ?? (p.comment ?? 'photo');
    img.src = p.image.startsWith('http') ? p.image : ('./' + p.image.replace(/^\.\//,''));
    img.onerror = () => { img.alt = '画像が見つかりません'; };

    const body = document.createElement('div');
    body.className = 'card-body';

    const meta = document.createElement('div');
    meta.className = 'meta';

    const date = document.createElement('div');
    date.className = 'date';
    date.textContent = p.date ?? '';

    const tags = document.createElement('div');
    tags.className = 'tags';
    for (const t of (p.tags ?? [])){
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    }

    meta.appendChild(date);
    meta.appendChild(tags);

    const c = document.createElement('p');
    c.className = 'comment';
    c.textContent = p.comment ?? '';

    body.appendChild(meta);
    body.appendChild(c);

    card.appendChild(img);
    card.appendChild(body);

    grid.appendChild(card);
  }
}

function apply(posts){
  const q = normalize(document.getElementById('q').value);
  const sort = document.getElementById('sort').value;

  let out = posts.filter(p => matches(p, q));

  out.sort((a,b) => {
    const ad = a.date ?? '';
    const bd = b.date ?? '';
    return sort === 'old' ? ad.localeCompare(bd) : bd.localeCompare(ad);
  });

  const status = document.getElementById('status');
  status.textContent = out.length ? `${out.length}件` : '該当なし';

  render(out);
}

(async function main(){
  const status = document.getElementById('status');
  try{
    const posts = await loadPosts();

    const q = document.getElementById('q');
    const sort = document.getElementById('sort');
    const handler = () => apply(posts);

    q.addEventListener('input', handler);
    sort.addEventListener('change', handler);

    apply(posts);
  }catch(e){
    status.textContent = '読み込み失敗: ' + (e?.message ?? e);
    console.error(e);
  }
})();
