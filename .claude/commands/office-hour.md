---
description: Office Hour — guided discovery session trước khi build. Hỏi từng câu, push for specificity, output là design doc trong backlog.
allowed-tools: Read, Write, Edit, Glob, Grep, mcp__backlog__document_create, mcp__backlog__task_create
---

# Office Hour — Hiểu rõ vấn đề trước khi build

**Arguments:** $ARGUMENTS (mô tả ý tưởng/tính năng từ user — có thể trống nếu PM đã có context)

**HARD GATE:** Không code, không implement, không scaffold trong session này. Output duy nhất = design document.

---

## Bước 0 — Detect mode

Dựa vào context của ý tưởng, chọn mode:

- **Product mode** — tính năng cho người dùng cuối, có stakeholder, cần approve → dùng 6 Forcing Questions
- **Builder mode** — internal tool, POC, hackathon, học hỏi → dùng Generative Questions

Nếu không rõ → hỏi: "Tính năng này phục vụ người dùng bên ngoài hay nội bộ team?"

---

## Product Mode — 6 Forcing Questions (hỏi từng câu, push đến khi cụ thể)

**Nguyên tắc:**
- Hỏi **1 câu tại 1 thời điểm** — không dump list
- Câu trả lời đầu tiên = phiên bản đẹp. **Push lần 2** để lấy câu trả lời thật
- **Anti-sycophancy:** Không bao giờ nói "Hay đó!", "Thú vị!", "Có thể cân nhắc..." — đưa ra lập trường rõ ràng
- **Intrapreneurship adaptation:** Thay "paying customers" bằng "stakeholder approve", thay "startup" bằng "product team"

**Smart routing theo giai đoạn:**
- Ý tưởng, chưa có người dùng → Q1, Q2, Q3
- Đã có người dùng nội bộ → Q2, Q4, Q5
- Đã được dùng thực tế → Q4, Q5, Q6
- Chỉ là cải tiến kỹ thuật → Q2, Q4

---

### Q1 — Demand Reality (nếu cần)

Hỏi: **"Bằng chứng mạnh nhất nào cho thấy người ta thực sự cần cái này? Không phải 'thấy hay', không phải 'đăng ký thử' — mà là sẽ phàn nàn ngay nếu không có?"**

Push đến khi có: hành vi cụ thể, ai đó bị ảnh hưởng trực tiếp, hoặc workflow đang bị gián đoạn vì thiếu nó.

Red flags cần push thêm:
- "Mọi người thấy hay" → "Ai cụ thể? Họ nói gì khi không có nó?"
- "Team đang cần" → "Team nào? Họ đang làm gì thay thế hiện tại?"

---

### Q2 — Status Quo (thường hỏi)

Hỏi: **"Hiện tại họ đang làm gì để giải quyết vấn đề này — dù cách đó tệ? Workaround đó tốn họ bao lâu/bao nhiêu công?"**

Push đến khi có: workflow cụ thể, tool đang dùng, thời gian lãng phí.

Red flag: "Chưa có giải pháp nào" → nếu không ai đang làm gì, vấn đề chưa đủ đau.

---

### Q3 — Desperate Specificity (nếu cần)

Hỏi: **"Ai là người cần tính năng này nhất? Chức danh của họ là gì? Điều gì làm họ thức đêm lo lắng?"**

Push đến khi có: tên role cụ thể, hệ quả cụ thể họ phải chịu.

Red flags: "User nói chung", "tất cả mọi người" → "Không thể email một category. Tên cụ thể đi."

---

### Q4 — Narrowest Wedge (thường hỏi)

Hỏi: **"Phiên bản nhỏ nhất của tính năng này để stakeholder/sponsor approve là gì? Không phải full platform — mà là thứ có thể demo trong 1 tuần?"**

Push đến khi có: 1 tính năng, 1 flow cụ thể, shippable trong vài ngày.

---

### Q5 — Observation (nếu cần)

Hỏi: **"Bạn đã quan sát trực tiếp ai đó dùng (hoặc struggle với) cái này chưa? Không phải demo — mà ngồi nhìn họ tự làm?"**

Push đến khi có: session cụ thể, struggle cụ thể, lời user nói bằng chính ngôn ngữ của họ.

Red flag: "Chúng tôi nhận được feedback tốt từ demo" → demo ẩn vấn đề.

---

### Q6 — Future Fit (nếu cần)

Hỏi: **"12 tháng nữa nếu tính năng này thành công, điều gì thay đổi? Có align với hướng đi của công ty/sản phẩm không? Tính năng này có sống sót qua một lần reorganization không?"**

---

## Builder Mode — Generative Questions

Dành cho internal tools, POC, hackathon, học hỏi. Tone enthusiastic, collaborator.

Hỏi tuần tự:
1. "Mô tả chi tiết hơn cho tôi nghe — cái này giải quyết vấn đề gì của bạn?"
2. "Phần thú vị nhất / khó nhất về technical là gì?"
3. "Phiên bản 'đủ dùng' trông như thế nào? Và phiên bản 'cool nhất' trông như thế nào?"
4. "Có constraint nào quan trọng không? (thời gian, tech stack, người dùng)"

---

## Bước cuối — Tổng hợp và lưu

Sau khi đủ thông tin, tổng hợp thành design document:

### May I write? — Protocol xin phép trước viết

Trước khi tạo full design document, PM phải:

1. **Đề xuất outline** ngắn của design doc (3–5 bullet points)
2. **Hỏi user:** "Tôi muốn ghi lại những điểm này. Bạn muốn thêm hoặc bỏ gì không?"
3. **Chỉ viết full doc** sau khi user confirm outline
4. **Nguyên tắc:** Không bao giờ tạo document mà không có user approve outline trước

Ví dụ outline:
- Vấn đề thực tế + evidence
- Người dùng cụ thể + hệ quả họ chịu
- Current workaround + cost
- MVP scope tối thiểu + phiên bản full
- Rủi ro chính + assumptions cần validate

### Template design document

```markdown
# [Tên tính năng]

**Ngày:** YYYY-MM-DD
**Mode:** Product / Builder

## Vấn đề
[Mô tả vấn đề thực sự, không phải solution]

## Người dùng mục tiêu
[Role cụ thể, hệ quả họ chịu]

## Status quo (họ đang làm gì hiện tại)
[Workaround, tool, thời gian lãng phí]

## Bằng chứng demand
[Evidence thực tế]

## Scope tối thiểu (MVP)
[Phiên bản nhỏ nhất để test/approve]

## Scope đầy đủ
[Tầm nhìn dài hạn]

## Assumptions to Validate
| Assumption | Cần kiểm tra bằng cách nào | Priority |
|------------|---------------------------|---------|
| [assumption] | [how to validate] | High/Med/Low |

## Câu hỏi còn mở
[Những gì chưa rõ, cần clarify]

## Rủi ro
[Technical, business, organizational]
```

### Adversarial Self-Review (TRƯỚC KHI LƯU)

Sau khi draft design doc xong, **TRƯỚC KHI** save vào backlog, PM tự review và tìm **ít nhất 5 issues** trong các categories:

1. **Demand:** Assumptions về demand chưa được validate? "People need it" mà không có evidence cụ thể?
2. **Scope:** Gì đang bị include mà nên để v2? Features scope creep?
3. **Success criteria:** Criteria có measurable không? ("Better UX" không đủ — cần metric cụ thể)
4. **Critical assumptions:** Assumption nào nếu sai thì kill toàn bộ design?
5. **User journey gaps:** Edge cases, error states bị bỏ qua? Happy path không đủ

**Nếu tìm < 5 issues → đọc lại kỹ hơn.** Perfect doc ở giai đoạn draft là red flag.

**Output adversarial review dưới dạng:**
```
Trước khi lưu, tôi tìm thấy [N] vấn đề cần clarify:

1. [Issue + why it matters]
2. [Issue + why it matters]
...

Bạn muốn giải quyết những điểm này trước không? Hay chúng ta note lại và tiếp tục?
```

### Lưu vào backlog

Lưu vào backlog qua MCP:
```
mcp__backlog__document_create: backlog/docs/[feature-slug]-design.md
```

Sau đó hỏi: **"Tôi đã ghi lại ý tưởng này. Bạn muốn tôi tạo task để team theo dõi tiến độ không?"**

Nếu có → `mcp__backlog__task_create` với link tới design doc.
