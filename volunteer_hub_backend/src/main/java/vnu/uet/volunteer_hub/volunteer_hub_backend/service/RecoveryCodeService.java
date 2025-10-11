package vnu.uet.volunteer_hub.volunteer_hub_backend.service;

import java.time.Duration;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

/**
 * Service lưu và kiểm tra mã khôi phục (recovery code) trong Redis.
 *
 * - Lưu cả 2 chiều: code -> email và email -> code (để dễ invalidate theo
 * email)
 * - Mã có TTL configurable (mặc định 10 phút)
 * - Khi validate thành công, mã sẽ bị tiêu hủy (one-time use)
 */
@Service
public class RecoveryCodeService {

    private static final Logger logger = LoggerFactory.getLogger(RecoveryCodeService.class);

    private final StringRedisTemplate redisTemplate;
    private final Duration ttl;

    public RecoveryCodeService(StringRedisTemplate redisTemplate,
            @Value("${recovery.code.ttl-minutes:10}") long ttlMinutes) {
        this.redisTemplate = redisTemplate;
        this.ttl = Duration.ofMinutes(ttlMinutes);
    }

    private String codeKey(String code) {
        return "recovery:code:" + code;
    }

    private String emailKey(String email) {
        return "recovery:email:" + (email == null ? "" : email.toLowerCase());
    }

    /**
     * Lưu recovery code (one-time) cho email vào Redis với TTL cấu hình.
     */
    public void storeRecoveryCode(String email, String code) {
        Objects.requireNonNull(email, "email must not be null");
        Objects.requireNonNull(code, "code must not be null");

        String ck = codeKey(code);
        String ek = emailKey(email);

        try {
            redisTemplate.opsForValue().set(ck, email, ttl);
            redisTemplate.opsForValue().set(ek, code, ttl);
            logger.debug("Stored recovery code for email={} codeKey={} ttl={}s", email, ck, ttl.getSeconds());
        } catch (Exception e) {
            logger.error("Failed to store recovery code in redis for email={}", email, e);
            throw e;
        }
    }

    /**
     * Kiểm tra xem inputCode có hợp lệ không. Nếu hợp lệ, trả về email liên quan và
     * xóa mã (one-time). Nếu không hợp lệ thì trả về null.
     */
    public String isValidRecoveryCode(String inputCode) {
        if (inputCode == null || inputCode.isBlank()) {
            return null;
        }

        String ck = codeKey(inputCode);
        String email = redisTemplate.opsForValue().get(ck);
        if (email == null) {
            logger.debug("Recovery code not found or expired: {}", inputCode);
            return null;
        }

        // consume: delete both keys
        try {
            String ek = emailKey(email);
            redisTemplate.delete(ck);
            redisTemplate.delete(ek);
            logger.debug("Consumed recovery code for email={}", email);
        } catch (Exception e) {
            logger.warn("Failed to fully consume recovery code for email={}: {}", email, e.getMessage());
        }

        return email;
    }

    /**
     * Hủy mã theo email (nếu muốn hủy khi user request). Không gây lỗi nếu không
     * tồn tại.
     */
    public void invalidateByEmail(String email) {
        if (email == null)
            return;
        String ek = emailKey(email);
        try {
            String code = redisTemplate.opsForValue().get(ek);
            redisTemplate.delete(ek);
            if (code != null) {
                redisTemplate.delete(codeKey(code));
            }
            logger.debug("Invalidated recovery code for email={}", email);
        } catch (Exception e) {
            logger.warn("Failed to invalidate recovery code for email={}", email, e);
        }
    }

    /**
     * Hủy mã theo code (nếu cần).
     */
    public void invalidateByCode(String code) {
        if (code == null)
            return;
        String ck = codeKey(code);
        try {
            String email = redisTemplate.opsForValue().get(ck);
            redisTemplate.delete(ck);
            if (email != null) {
                redisTemplate.delete(emailKey(email));
            }
            logger.debug("Invalidated recovery code={}", code);
        } catch (Exception e) {
            logger.warn("Failed to invalidate recovery code={}", code, e);
        }
    }
}
