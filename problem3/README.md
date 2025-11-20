# Những chỗ đã fix trong code

Đây là những vấn đề mình tìm thấy và cách fix:

## Type Safety

Đầu tiên là về type. Code dùng `balance.blockchain` nhưng interface `WalletBalance` không có property này, nên mình thêm vào. Còn hàm `getPriority` thì dùng `any` nên mất type safety, mình tạo type `Blockchain` union để type chặt hơn.

Còn một chỗ nữa là `formattedBalances` map từ `WalletBalance[]` nhưng lại dùng như `FormattedWalletBalance[]`, nên mình fix type cho đúng.

## Logic bugs

Có mấy bug logic khá nghiêm trọng:

1. **Line 38**: Code dùng biến `lhsPriority` nhưng biến này không tồn tại, chắc là copy-paste sai. Mình đổi thành `balancePriority`.

2. **Filter logic bị ngược**: Code filter giữ lại những balance có `amount <= 0`, tức là giữ số âm và số 0, bỏ số dương. Logic này sai rõ ràng. Mình fix thành chỉ giữ balance có priority hợp lệ (> -99) và amount > 0.

3. **Sort function thiếu return 0**: Khi hai priority bằng nhau thì không return gì cả, có thể gây unstable sort. Mình thêm `return 0` vào.

## Performance issues

Có khá nhiều vấn đề về performance:

- `getPriority` function được define bên trong component nên mỗi lần render lại tạo function mới. Mình move ra ngoài component.

- `formattedBalances` và `rows` được tính toán lại mỗi lần render dù data không đổi. Mình wrap cả hai bằng `useMemo` để chỉ tính lại khi dependency thay đổi.

- Dùng `index` làm React key là anti-pattern, có thể gây bug khi list reorder. Mình đổi sang dùng `balance.currency` vì nó unique và stable.

- `useMemo` của `sortedBalances` có `prices` trong dependency array nhưng không dùng đến, nên mình bỏ đi.

## Code quality

- `toFixed()` không có parameter nên mặc định là 0 chữ số thập phân, không phù hợp với currency. Mình đổi thành `toFixed(2)`.

- Thiếu type definition cho `BoxProps`, mình thêm vào.

## Tóm lại

Những thay đổi chính:

- Fix type definitions
- Fix filter logic (giữ số dương thay vì số âm)
- Fix undefined variable
- Hoàn thiện sort function
- Move `getPriority` ra ngoài component
- Memoize `formattedBalances` và `rows`
- Đổi React key từ index sang currency
- Bỏ dependency không cần thiết
- Format currency đúng 2 chữ số thập phân

Về performance, trước đây code tính toán lại mọi thứ mỗi lần render. Giờ chỉ tính lại khi data thực sự thay đổi, nên nhanh hơn và React reconciliation cũng hiệu quả hơn.
